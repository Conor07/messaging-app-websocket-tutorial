import React, { createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContacts, type Contact } from "./ContactsProvider";

export type Conversation = {
  recipients: string[];
  messages: string[];
};

export type FormattedConversations = {
  recipients: { id: string; name: string }[];
  messages: string[];
  selected: boolean;
} & Conversation;

type ConversationsContextType = {
  //   conversations: Conversation[];
  conversations: FormattedConversations[];
  createConversation: (recipients: string[]) => void;
  selectedConversation: Conversation;
  selectConversationIndex: React.Dispatch<React.SetStateAction<number>>;
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
  children,
}: {
  children: React.ReactNode;
}) => {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>(
    "conversations",
    () => []
  );
  const [selectedConversationIndex, setSelectedConversationIndex] =
    useState<number>(0);

  const { contacts } = useContacts();

  const createConversation = (recipients: string[]) => {
    setConversations((prevConversations: Conversation[]) => [
      ...prevConversations,
      { recipients, messages: [] },
    ]);
  };

  const formattedConversations = conversations?.map(
    (conversation: Conversation, index: number) => {
      const recipients = conversation.recipients.map((recipient) => {
        const contact = contacts.find((contact: Contact) => {
          return contact.id === recipient;
        });

        const name = (contact && contact.name) || recipient;

        return { id: recipient, name };
      });
      const selected = index === selectedConversationIndex;

      return { ...conversation, recipients, selected };
    }
  );

  const value = {
    conversations: formattedConversations,
    selectedConversation: formattedConversations[selectedConversationIndex],
    selectConversationIndex: setSelectedConversationIndex,
    createConversation,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
};

export default ConversationsProvider;
