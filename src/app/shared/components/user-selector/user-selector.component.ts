import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

interface User {
  id: string;
  name: string;
}

@Component({
  selector: 'app-user-selector',
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.scss']
})
export class UserSelectorComponent implements OnInit {
  @Input()
  users: User[] = [];

  userSearch = new UntypedFormControl();

  ngOnInit(): void {
    this.userSearch.valueChanges.subscribe({
      next: (value: User) => this.addUser(value)
    });
  }

  addUser(user: User) {
    if (!this.users.some(u => u.id === user.id)) {
      this.users.push(user);
    }
  }

  removeUser(user: Pick<User, 'id'>) {
    this.users = this.users.filter(u => u.id !== user.id);
  }
}
