// src/mocks/data.ts
export const mockStats = [
  { label: "Faturamento (hoje)", value: "R$ 2.340", trend: "+12% vs. ontem" },
  { label: "Pedidos em andamento", value: "8" },
  { label: "Itens no cardápio", value: "42" },
  { label: "Clientes", value: "1.203" },
];

export type Order = {
  id: string;
  cliente: string;
  total: number;
  status: "Em preparo" | "Pronto" | "Entregue";
  hora: string;
};

export const mockOrders: Order[] = [
  { id: "1024", cliente: "Maria Souza", total: 84.9, status: "Em preparo", hora: "há 5 min" },
  { id: "1025", cliente: "João Lima", total: 58.5, status: "Pronto", hora: "há 2 min" },
  { id: "1026", cliente: "Ana Paula", total: 42.0, status: "Entregue", hora: "há 10 min" },
];

export const mockMenu = [
  { id: "p1", nome: "Hambúrguer Artesanal", preco: 29.9, categoria: "Lanches" },
  { id: "p2", nome: "Pizza Margherita", preco: 49.9, categoria: "Pizzas" },
  { id: "p3", nome: "Brownie com Sorvete", preco: 19.9, categoria: "Sobremesas" },
];
