import { create } from "zustand";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useTokenStore } from "./tokenStore";

interface SignalRStore {
  connection: HubConnection | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  invoke: (methodName: string, ...args: any[]) => Promise<any>;
  on: (eventName: string, callback: (...args: any[]) => void) => void;
  off: (eventName: string, callback?: (...args: any[]) => void) => void;
}

export const useSignalRStore = create<SignalRStore>((set, get) => ({
  connection: null,
  isConnected: false,
  isConnecting: false,

  connect: async () => {
    const { jwtToken } = useTokenStore.getState();
    if (!jwtToken) {
      throw new Error("No JWT token available for SignalR connection");
    }

    set({ isConnecting: true });

    try {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:8080/hubs/messages", {
          accessTokenFactory: () => jwtToken,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connection.onclose(() => {
        set({ isConnected: false, connection: null });
      });

      connection.onreconnected(() => {
        set({ isConnected: true });
      });

      await connection.start();
      set({ connection, isConnected: true, isConnecting: false });
    } catch (error) {
      set({ isConnecting: false });
      throw error;
    }
  },

  disconnect: async () => {
    const { connection } = get();
    if (connection) {
      await connection.stop();
      set({ connection: null, isConnected: false });
    }
  },

  invoke: async (methodName: string, ...args: any[]) => {
    const { connection } = get();
    if (!connection) {
      throw new Error("SignalR connection not established");
    }
    return await connection.invoke(methodName, ...args);
  },

  on: (eventName: string, callback: (...args: any[]) => void) => {
    const { connection } = get();
    if (connection) {
      connection.on(eventName, callback);
    }
  },

  off: (eventName: string, callback?: (...args: any[]) => void) => {
    const { connection } = get();
    if (connection) {
      if (callback) {
        connection.off(eventName, callback);
      } else {
        connection.off(eventName);
      }
    }
  },
}));