import Chat from 'components/Chat/Chat';
import React, { forwardRef, MutableRefObject, useCallback, useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { ChatZone, Section, StickyHeader } from './ChatList.styles';
import { ChatListProps } from './ChatList.types';

const ChatList = forwardRef<Scrollbars, ChatListProps>(
  ({ chatSections, setSize, isReachingEnd }: ChatListProps, scrollbarRef) => {
    const onScroll = useCallback(
      (values) => {
        if (values.scrollTop === 0 && !isReachingEnd) {
          setSize((prevSize) => prevSize + 1).then(() => {
            const current = (scrollbarRef as MutableRefObject<Scrollbars>)?.current;
            if (current) {
              current.scrollTop(current.getScrollHeight() - values.scrollHeight);
            }
          });
        }
      },
      [scrollbarRef, isReachingEnd, setSize],
    );

    return (
      <ChatZone>
        <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
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
  },
);

export default ChatList;
