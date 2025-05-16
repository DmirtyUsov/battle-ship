import { Command, LoginDTO, Message, RegistrationDTO } from '../models';
import { makeVoidCommand } from './make-void-command';

export const addPlayerCtrl = (fromMessage: Message): Message => {
  const command: Command = makeVoidCommand();
  const toMessage: Message = {
    ...fromMessage,
    direction: 'to',
    command,
  };

  const { name, password } = fromMessage.command.data as LoginDTO;
  if (!name) {
    const registrationDTO: RegistrationDTO = {
      name,
      index: 0,
      error: true,
      errorText: 'Empty name.',
    };
    toMessage.command.data = registrationDTO;

    return toMessage;
  }
  return toMessage;
};
