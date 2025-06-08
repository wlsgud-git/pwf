import { Dispatch, FormEvent } from "react";

export type InputChange = React.ChangeEvent<HTMLInputElement>;
export type FormSubmit = FormEvent<HTMLFormElement>;
export type ButtonClick = React.MouseEvent<HTMLButtonElement>;
export type StateDispatch<T> = Dispatch<React.SetStateAction<T>>;
