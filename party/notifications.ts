import type * as Party from "partykit/server";

export type Actions = "create" | "update" | "delete";

export type NotificationAction = {
  categoryId: string;
  message: string;
  time: Date;
  name?: string | null;
  userId?: string | null;
  avatarUrl?: string | null;
};

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}

  onMessage(payload: string, sender: Party.Connection<unknown>) {
    const action = JSON.parse(payload) as NotificationAction;

    this.party.broadcast(JSON.stringify(action), [sender.id]);
  }
}

Server satisfies Party.Worker;
