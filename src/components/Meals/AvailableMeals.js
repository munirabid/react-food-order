import React, { useEffect, useState } from "react";
import Card from "../UI/Card";
import classes from "./AvailableMeals.module.css";
import MealItem from "./MealItem/MealItem";
import useHttp from "./../../hooks/use-http";

const AvailableMeals = () => {
  const [availableMeals, setAvailableMeals] = useState([]);

  const { isLoading, error, sendRequest: fetchMeals } = useHttp();

  useEffect(() => {
    const transformMeals = (mealsObj) => {
      const loadedMeals = [];
      for (const mealKey in mealsObj) {
        loadedMeals.push({
          key: mealKey,
          id: mealKey,
          name: mealsObj[mealKey].name,
          description: mealsObj[mealKey].description,
          price: mealsObj[mealKey].price,
        });
      }

      setAvailableMeals(loadedMeals);
    };

    fetchMeals(
      {
        url: "https://react-http-9f5a0-default-rtdb.europe-west1.firebasedatabase.app/meals.json",
      },
      transformMeals
    );
  }, [fetchMeals]);

  const mealsList = availableMeals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  let content = (
    <Card>
      <ul>{mealsList}</ul>
    </Card>
  );
  if (isLoading) {
    content = <p>Loading...</p>;
  }
  if (error) {
    content = <p>Something went wrong!!!</p>;
  }
  return <section className={classes.meals}>{content}</section>;
};

export default AvailableMeals;
