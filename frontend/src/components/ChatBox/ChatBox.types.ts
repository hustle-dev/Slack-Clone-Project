import { IUser } from 'typings/db';

export interface ChatBoxProps {
  chat: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder: string;
  data?: IUser[];
}
