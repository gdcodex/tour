const brray = [
    {
        id: "7749",
        name: "eghxygho",
      },
  {
    id: "6969",
    name: "rickkkia",
  },
  {
    id: "6969",
    name: "octavia",
  },
  {
    id: "6969",
    name: "bellama",
  },
  {
    id: "7749",
    name: "echo",
  },
  {
    id: "6969",
    name: "swctavia",
  },
];

let array = brray;

array.map((e, i) => {

  array.map((v, ii) => {
    if (i !== ii) {
      if(e.id === v.id) array.splice(ii, 1);
    }
    return;
  });
});

console.log(array); 
