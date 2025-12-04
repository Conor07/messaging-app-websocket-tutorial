import React, { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export type Contact = {
  id: string;
  name: string;
};

type ContactsContextType = {
  contacts: Contact[];
  createContact: (id: string, name: string) => void;
};

const ContactsContext = createContext<ContactsContextType | undefined>(
  undefined
);

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error("useContacts must be used within a ContactsProvider");
  }
  return context;
};

export const ContactsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [contacts, setContacts] = useLocalStorage<Contact[]>(
    "contacts",
    () => []
  );

  const createContact = (id: string, name: string) => {
    setContacts((prevContacts) => {
      const current = prevContacts ?? [];
      return [...current, { id, name }];
    });
  };

  return (
    <ContactsContext.Provider
      value={{ contacts: contacts ?? [], createContact }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export default ContactsProvider;
