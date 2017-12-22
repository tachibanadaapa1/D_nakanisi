import Person from './person';

class Friend extends Person {
  callName() {
    alert(this.name);
  }
}

const friend = new Friend('DMM');

friend.callName();
