import { Driver } from '../types/Driver';

// autisti registrati staticamente per il test
export let registeredDrivers: Driver[] = [
  {
    nome: "Gianni",
    cognome: "Verdi",
    dataNascita: new Date("2002-02-02"),
    email: "gianniverdi@gmail.com",
    password: "12345678",
    veicolo: "Fiat Panda"
  }
];

export const addDriver = (driver: Driver) => {
  registeredDrivers.push(driver);
};

export const findDriverByCredentials = (email: string, password: string): Driver | undefined => {
  return registeredDrivers.find(driver => driver.email === email && driver.password === password);
}; 