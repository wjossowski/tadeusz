import { IInteractorConfig } from "../utils/interactor";

export type IsClass<T> = new (...args: any[]) => T;

export type InteractorFactory<T> = (props: IInteractorConfig) => T;
