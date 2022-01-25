import Chat from 'components/Chat/Chat';
import React, { useCallback, useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { ChatZone, Section, StickyHeader } from './ChatList.styles';
import { ChatListProps } from './ChatList.types';

export default function ChatList({ chatSections }: ChatListProps) {
  const scrollbarRef = useRef(null);
  // const onScroll = useCallback(() => {}, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button type="button">{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
}
