declare global {
  interface Window {
    api: {
      invoke: (action: string, payload?: unknown) => Promise<any>;
    };
  }
}
// export {} to make TS treat this as a module
export {};
