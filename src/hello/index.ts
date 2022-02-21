import { HelloInteractor } from "./hello.interactor";
import { IInteractorConfig } from "../common/utils/interactor";
import { InteractorFactory } from "../common/typedefs/common";

export const helloInteractor: InteractorFactory<HelloInteractor> = (
  props: IInteractorConfig
) => new HelloInteractor(props);
