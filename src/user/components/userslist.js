import React from "react";
import "./userslist.css";
import Useritem from "./useritem";

import Card from "../../shared/components/UIElements/Card";

function Userslist(props) {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <Useritem
          key={user.id}
          id={user.id}
          image={user.imageUrl}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
}

export default Userslist;
