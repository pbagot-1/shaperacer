var importMap = require("./ExpiringMap.js");

var b = new importMap.ExpiringMap();
console.log(b);
b.put("foo",{someNumber:321});
console.log(b.get("foo"));
//var map = new ExpiringMap();
//map.put("foo",{someNumber:321});
//console.log(map.get("foo");
