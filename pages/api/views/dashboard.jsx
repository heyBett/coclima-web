import { prisma } from "../../../db";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

const _ = require("lodash");

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    if (session.user.role === "Admin") {
      const result = await prisma.companies.findMany({
        select: {
          handler: {
            select: {
              id: true,
              value: true,
              plantations: {
                select: {
                  planted: true,
                  tree_value: true,
                  date: true,
                },
              },
            },
          },
        },
      });

      function isPlanted(item) {
        return item.plantations.planted;
      }

      function havePlantation(item) {
        return item.plantations.length > 0;
      }

      const allHandlers = result.map((item) => item.handler);

      const wrappedArray = _.flatten(allHandlers);

      const filteredArray = wrappedArray.filter(isPlanted);

      const valueArray = filteredArray.map((item) => item.value);
      const toDateArray = filteredArray.map((item) => item);
      const treesArray = filteredArray.map(
        (item) => item.value / item.plantations.tree_value
      );

      const totalTrees = treesArray.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);

      const totalValue = valueArray.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);

      const totalCarbon = totalTrees * 130;

      const month = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      const dateArray = toDateArray.map((item) => ({
        value: item.value,
        trees: item.plantations.tree_value,
        planted: item.plantations.planted,
        dateStr:
          month[item.plantations.date.getMonth()] +
          "/" +
          item.plantations.date.getFullYear(),
        dateInt:
          parseInt(item.plantations.date.getMonth() + 1) +
          "/" +
          item.plantations.date.getFullYear(),
      }));

      const orderedByMonth = _.orderBy(dateArray, ["dateInt"], ["asc"]);

      const groupedByMonth = _.groupBy(orderedByMonth, "dateStr");

      console.log(groupedByMonth);

      const valueGraph = Object.keys(groupedByMonth).map((item) => ({
        value: _.sumBy(groupedByMonth[item], "value").toFixed(2),
        month: item,
      }));

      const treeGraph = Object.keys(groupedByMonth).map((item) => ({
        month: item,
        value: Math.ceil(
          _.sumBy(groupedByMonth[item], "value").toFixed(0) /
            _.sumBy(groupedByMonth[item], "trees").toFixed(0)
        ),
      }));

      res.json({
        value: totalValue,
        trees: totalTrees,
        carbon: totalCarbon,
        graph: {
          valueGraph: valueGraph,
          treeGraph: treeGraph,
        },
      });
    } else {
      const result = await prisma.companies.findUnique({
        where: {
          id: session.user.company_id,
        },
        select: {
          handler: {
            select: {
              id: true,
              value: true,
              plantations: {
                select: {
                  planted: true,
                  tree_value: true,
                  date: true,
                },
              },
            },
          },
        },
      });

      function isPlanted(item) {
        return item.plantations.planted;
      }

      function havePlantation(item) {
        return item.plantations.length > 0;
      }

      const filteredArray = result.handler.filter(isPlanted);

      const valueArray = filteredArray.map((item) => item.value);
      const toDateArray = filteredArray.map((item) => item);
      const treesArray = filteredArray.map(
        (item) => item.value / item.plantations.tree_value
      );

      const totalTrees = treesArray.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);

      const totalValue = valueArray.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);

      const totalCarbon = totalTrees * 130;

      const month = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      const dateArray = toDateArray.map((item) => ({
        value: item.value,
        trees: item.plantations.tree_value,
        planted: item.plantations.planted,
        dateStr:
          month[item.plantations.date.getMonth()] +
          "/" +
          item.plantations.date.getFullYear(),
        dateInt:
          parseInt(item.plantations.date.getMonth() + 1) +
          "/" +
          item.plantations.date.getFullYear(),
      }));

      console.log(dateArray);

      const orderedByMonth = _.orderBy(dateArray, ["dateInt"], ["asc"]);

      const groupedByMonth = _.groupBy(orderedByMonth, "dateStr");

      console.log(groupedByMonth);

      const valueGraph = Object.keys(groupedByMonth).map((item) => ({
        value: _.sumBy(groupedByMonth[item], "value").toFixed(2),
        month: item,
      }));

      const treeGraph = Object.keys(groupedByMonth).map((item) => ({
        month: item,
        value:
          _.sumBy(groupedByMonth[item], "value").toFixed(0) /
          _.sumBy(groupedByMonth[item], "trees").toFixed(0),
      }));

      res.json({
        value: totalValue,
        trees: totalTrees,
        carbon: totalCarbon,
        graph: {
          valueGraph: valueGraph,
          treeGraph: treeGraph,
        },
      });
    }
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
