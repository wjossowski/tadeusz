import { HelloInteractor } from "./hello.interactor";
import {
  IInteractorConfig,
  InteractorFactory,
} from "@common/infrastructure/providers/discord/interactor";

export const helloInteractor: InteractorFactory<HelloInteractor> = (
  props: IInteractorConfig
) => new HelloInteractor(props);
