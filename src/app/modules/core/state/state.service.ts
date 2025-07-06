import { Injectable } from '@angular/core';
import { State } from './state.class';

interface IState {
  // Define State Structure
}

const initialState: IState = {
  // Define Initial State
};


@Injectable({
  providedIn: 'root'
})
export class StateService extends State<IState>{
  constructor() {
    super(initialState);
  }

  public resetState(): void {
    this.setCurrentState(initialState);
  }

  public setState(param: Partial<IState>) {
    this.setCurrentState({...this.currentState, ...param});
  }

  // Define Selectors
  public currentState$   = this.select(state => state);
}
