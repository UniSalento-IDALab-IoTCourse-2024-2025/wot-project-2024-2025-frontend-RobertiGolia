export interface User {
  nome: string;
  cognome: string;
  dataNascita: Date;
  email: string;
  emailParente?: string;
  password: string;
  veicolo?: string;  // Campo opzionale per gli autisti
}

// Utenti predefiniti a caso, giusto per fare il test
export let registeredUsers: User[] = [
  {
    nome: "Giorgio",
    cognome: "Bianchi",
    dataNascita: new Date("1999-01-15"),
    email: "giorgiobianchi@gmail.com",
    emailParente: "lucabianchi@gmail.com",
    password: "12345678"
  },
  {
    nome: "Maria",
    cognome: "Rossi",
    dataNascita: new Date("2000-03-20"),
    email: "mariarossi@gmail.com",
    emailParente: "genitorerossi@gmail.com",
    password: "12345678"
  },
  {
    nome: "Luca",
    cognome: "Verdi",
    dataNascita: new Date("2001-07-10"),
    email: "lucaverdi@gmail.com",
    password: "12345678"
  }
];

export const addUser = (user: User) => {
  registeredUsers.push(user);
};

export const findUserByCredentials = (email: string, password: string): User | undefined => {
  return registeredUsers.find(user => user.email === email && user.password === password);
}; 