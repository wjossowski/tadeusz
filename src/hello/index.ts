import { HelloInteractor } from "./hello.interactor";
import { IInteractorConfig, InteractorFactory } from "@common/utils/interactor";

export const helloInteractor: InteractorFactory<HelloInteractor> = (
  props: IInteractorConfig
) => new HelloInteractor(props);
