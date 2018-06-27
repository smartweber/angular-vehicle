import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';

export class DamageModalContent extends BSModalContext {
  constructor(public autoPartID: number, public carMap: any) {
    super();
  }
}
