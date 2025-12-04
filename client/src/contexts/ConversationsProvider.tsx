import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContacts, type Contact } from "./ContactsProvider";
import { useSocket } from "./SocketProvider";

export type Conversation = {
  recipients: string[];
  messages: { sender: string; text: string }[];
};

export type FormattedConversation = {
  recipients: { id: string; name: string }[];
  messages: {
    senderName: string;
    fromMe: boolean;
    sender: string;
    text: string;
  }[];
  selected: boolean;
} & Conversation;

type ConversationsContextType = {
  //   conversations: Conversation[];
  conversations: FormattedConversation[];
  createConversation: (recipients: string[]) => void;
  selectedConversation: FormattedConversation;
  selectConversationIndex: React.Dispatch<React.SetStateAction<number>>;
  sendMessage: (recipients: string[], text: string) => void;
};

const ConversationsContext = createContext<
  ConversationsContextType | undefined
>(undefined);

export const useConversations = () => {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error(
      "useConversations must be used within a ConversationsProvider"
    );
  }
  return context;
};

export const ConversationsProvider = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>(
    "conversations",
    () => []
  );
  const [selectedConversationIndex, setSelectedConversationIndex] =
    useState<number>(0);

  const { contacts } = useContacts();

  const { socket } = useSocket();

  const createConversation = (recipients: string[]) => {
    setConversations((prevConversations: Conversation[]) => [
      ...prevConversations,
      { recipients, messages: [] },
    ]);
  };

  const addMessageToConversation = useCallback(
    ({
      recipients,
      text,
      sender,
    }: {
      recipients: string[];
      text: string;
      sender: string;
    }) => {
      setConversations((prevConversations: Conversation[]) => {
        let madeChange: boolean = false;

        const newMessage: { sender: string; text: string } = { sender, text };

        const newConversations: Conversation[] = prevConversations?.map(
          (conversation) => {
            if (arrayEquality(conversation?.recipients, recipients)) {
              madeChange = true;

              return {
                ...conversation,
                messages: [...conversation.messages, newMessage],
              };
            }

            return conversation;
          }
        );

        if (madeChange) {
          return newConversations;
        } else {
          return [...prevConversations, { recipients, messages: [newMessage] }];
        }
      });
    },
    [setConversations]
  );

  const sendMessage = (recipients: string[], text: string) => {
    if (socket) socket.emit("send-message", { recipients, text });

    addMessageToConversation({ recipients, text, sender: id });
  };

  useEffect(() => {
    if (socket === null) return;
    socket.on("receive-message", addMessageToConversation);

    return () => {
      socket.off("receive-message", addMessageToConversation);
    };
  }, [socket, addMessageToConversation]);

  const formattedConversations = conversations?.map(
    (conversation: Conversation, index: number) => {
      const recipients = conversation.recipients.map((recipient) => {
        const contact = contacts.find((contact: Contact) => {
          return contact.id === recipient;
        });

        const name = (contact && contact.name) || recipient;

        return { id: recipient, name };
      });

      const messages = conversation.messages.map((message) => {
        const contact = contacts.find((contact: Contact) => {
          return contact.id === message.sender;
        });

        const name = (contact && contact.name) || message.sender;

        const fromMe = id === message.sender;

        return { ...message, senderName: name, fromMe };
      });

      const selected = index === selectedConversationIndex;

      return { ...conversation, messages, recipients, selected };
    }
  );

  const value = {
    conversations: formattedConversations,
    selectedConversation: formattedConversations[selectedConversationIndex],
    selectConversationIndex: setSelectedConversationIndex,
    createConversation,
    sendMessage,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
};

export default ConversationsProvider;

export const arrayEquality = (a: any[], b: any[]) => {
  if (a.length !== b.length) {
    return false;
  }

  a.sort();

  b.sort();

  return a.every((element, idx) => {
    return element === b[idx];
  });
};
