export interface Ride {
  id: string;
  orario: string;
  nomeCliente: string;
  puntoPartenza: string;
  stato: 'prenotata' | 'accettata' | 'completata';
}

// Corse prenotate staticamente, giusto per fare il test
export let rides: Ride[] = [
  {
    id: '1',
    orario: '10:30',
    nomeCliente: 'Giorgio Bianchi',
    puntoPartenza: 'Via Roma 123, Milano',
    stato: 'prenotata'
  },
  {
    id: '2',
    orario: '14:45',
    nomeCliente: 'Maria Rossi',
    puntoPartenza: 'Piazza Duomo 1, Milano',
    stato: 'prenotata'
  },
  {
    id: '3',
    orario: '16:15',
    nomeCliente: 'Luca Verdi',
    puntoPartenza: 'Corso Italia 45, Milano',
    stato: 'prenotata'
  }
]; 