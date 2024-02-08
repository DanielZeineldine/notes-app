import { create } from "zustand";

interface Store {
  token: string;
  setToken: (token: string) => void;
}

const useStore =  create<Store>((set) => ({
  token: localStorage.getItem("authtoken") || "",
  setToken: (token) => set({token})
}));

export default useStore;
