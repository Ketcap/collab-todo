import type { Todo } from "@prisma/client";
import type * as Party from "partykit/server";

export type Actions = "create" | "update" | "delete";

export type ServerAction = {
  todoId: string;
  action: Actions;
  todo?: Todo;
  categoryId: string;
};

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}

  onMessage(payload: string, sender: Party.Connection<unknown>) {
    const action = JSON.parse(payload) as ServerAction;

    this.party.broadcast(JSON.stringify(action), [sender.id]);
  }
}

Server satisfies Party.Worker;
