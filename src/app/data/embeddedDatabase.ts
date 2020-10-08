export class EmbeddedDatabase {
  public static readonly missionOrderstatus = [
    { value: 0, title: 'Non facturé' },
    { value: 1, title: 'Facturé' },
    { value: 2, title: 'Tous' }
  ];
  public static readonly dayWorks = [
    { name: 'Ne pas facturer', day: 0 },
    { name: 'Demi-Journée', day: 0.5 },
    { name: 'Une Journée', day: 1 },
    { name: 'Une journée et démi', day: 1.5 },
    { name: 'Deux jours', day: 2 },
    { name: 'Deux jours et démi', day: 2.5 },
    { name: 'Trois jours', day: 3 },
  ];
  public static readonly availableClaims = ['techAdmin', 'root', 'guest', 'HrM', 'SeM', 'AdM', 'Dir'];

  public static readonly notes = [
    { noteValue: 1, noteText: 'Info AVS FR', title: 'AVS FR' },
    { noteValue: 2, noteText: 'Info CA', title: 'CA' },
    { noteValue: 3, noteText: 'Info GEIE', title: 'GEIE' },
    { noteValue: 4, noteText: 'Traitement AVS FR', title: 'AVS FR' },
    { noteValue: 5, noteText: 'Traitement CA', title: 'CA' },
    { noteValue: 6, noteText: 'Traitement GEIE', title: 'GEIE' }
  ];
  public static readonly basicAccessRights = ['get', 'list', 'create', 'edit', 'delete', 'admin', 'superAdmin'];
  public static readonly modulesUniqueKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'i1', 'j1', 'k1', 'l1', 'm1', 'n1', 'o1', 'p1', 'q1', 'r1', 's1', 't1', 'u1', 'v1', 'w1', 'x1', 'y1', 'z1'];

  public static readonly hierarchyLevels = [
    { value: 1, title: '1' },
    { value: 2, title: '2' },
    { value: 3, title: '3' },
  ];

  public static readonly weeks =
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
      35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52
    ];
}
