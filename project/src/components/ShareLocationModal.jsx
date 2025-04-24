import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

export const ShareLocationModal = ({
  isOpen,
  onClose,
  contacts,
  onStartSharing,
}) => {
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactToggle = (contactId) => {
    setSelectedContacts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  };

  const handleStartSharing = () => {
    const selectedContactsList = contacts.filter((contact) =>
      selectedContacts.has(contact.id)
    );
    onStartSharing(selectedContactsList);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Location</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => handleContactToggle(contact.id)}
              >
                <Checkbox
                  checked={selectedContacts.has(contact.id)}
                  onCheckedChange={() => handleContactToggle(contact.id)}
                />
                <Avatar>
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>
                    {contact.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{contact.name}</span>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleStartSharing}
            disabled={selectedContacts.size === 0}
          >
            Start Sharing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 