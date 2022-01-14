import React, { useContext, useState } from "react"
import { v4 as uuidV4 } from "uuid"
import useLocalStorage from "../hooks/useLocalStorage"

const BudgetsContext = React.createContext()

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized"

export function useBudgets() {
  return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useLocalStorage("budgets", [])
  const [expenses, setExpenses] = useLocalStorage("expenses", [])

  function getBudgetExpenses(budgetId) {
    return expenses.filter(expense => expense.budgetId === budgetId)
  }

  // THIS FUNCTION ADDS EXPENSE TO A SPECIFIC BUDGET.
  // IT EXPECTS BUDGETID, AMOUNT OF SPENDING, DESCRIPTION OF AN EXPENSE.
  function addExpense({ description, amount, budgetId }) {
    // WILL RETURN ALL EXPENSES IN AN ARRAY OF OBJECTS INCLUDING THE NEW EXPENSE.
    // AND GIVE A RANDOM ID
    setExpenses(prevExpenses => {
      return [...prevExpenses, { id: uuidV4(), description, amount, budgetId }]
    })
  }

  // THIS FUNCTION ADDS A BUDGET. IT EXPECTS NAME AND MAXIMUM SPENDING AMOUNT AS INPUTS
  function addBudget({ name, max }) {
    // CHECK IF NAME OF THE BUDGET IS ALREADY THERE.
    // IF YES, RETURN WHAT WAS ALREADY THERE.
    // IF NO, ADD A NEW BUDGET AND RETURN ALL BUDGETS.
    setBudgets(prevBudgets => {
      if (prevBudgets.find(budget => budget.name === name)) {
        return prevBudgets
      }
      return [...prevBudgets, { id: uuidV4(), name, max }]
    })
  }

  function deleteBudget({ id }) {
    setExpenses(prevExpenses => {
      return prevExpenses.map(expense => {
        if (expense.budgetId !== id) return expense
        return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID }
      })
    })
    setBudgets(prevBudgets => {
      return prevBudgets.filter(budget => budget.id !== id)
    })
  }

  function deleteExpense({ id }) {
    setExpenses(prevExpenses => {
      return prevExpenses.filter(expense => expense.id !== id)
    })
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  )
}
