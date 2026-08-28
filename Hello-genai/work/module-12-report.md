# Module 12 Completion Report

## Instruction File
- Filename: instructions/calculate-compound-interest.agent.md

- Use this instruction when the user asks to calculate compound interest or future value for an investment, loan, or savings scenario.
  + Trigger examples: "compound interest", "future value", "interest earned", "monthly compounding", "loan growth", "savings projection".
  + Use the script at `./tools/compound_interest.py` instead of calculating manually when the question includes principal, annual rate, compounding frequency, and time.
- Invoke the script with command-line arguments in this order: `principal annual_rate compounds_per_year years`.
  + Example: `python3 ./tools/compound_interest.py 15847 7.34 12 8.583333333333334`
  + `principal` is the starting amount in dollars.
  + `annual_rate` is the yearly percentage rate, such as `7.34` for 7.34%.
  + `compounds_per_year` is the number of times interest compounds each year, such as `12` for monthly.
  + `years` is the total time in years, including fractional years when needed.
- Run the script before answering a finance question when the user expects numeric results.
  + If the script fails, confirm the arguments are numeric and in the correct order.
  + Use the script output directly unless the user asks for a custom explanation or formula derivation.
- Present results in a concise, professional format.
  + State the final amount and interest earned with currency formatting.
  + Example: `Final amount: $29,697.95` and `Interest earned: $13,850.95`.
  + Keep the response brief and factual; do not add marketing language or filler.
- Keep the tool usage deterministic and repeatable.
  + Prefer the script for all compound-interest calculations in this project.
  + Do not rely on mental math or approximations when the script is available.

## Script File
- Filename: tools/compound_interest.py
- Language: Python

#!/usr/bin/env python3
import argparse


def calculate_compound_interest(principal: float, annual_rate: float, compounds_per_year: int, years: float):
    amount = principal * (1 + annual_rate / 100 / compounds_per_year) ** (compounds_per_year * years)
    interest = amount - principal
    return amount, interest


def main():
    parser = argparse.ArgumentParser(description="Calculate compound interest for a principal amount.")
    parser.add_argument("principal", type=float, help="Initial principal amount")
    parser.add_argument("annual_rate", type=float, help="Annual interest rate in percent (for example 7.34)")
    parser.add_argument("compounds_per_year", type=int, help="Number of compounding periods per year")
    parser.add_argument("years", type=float, help="Total time in years")
    args = parser.parse_args()

    final_amount, interest_earned = calculate_compound_interest(
        args.principal,
        args.annual_rate,
        args.compounds_per_year,
        args.years,
    )

    print(f"Final amount: ${final_amount:,.2f}")
    print(f"Interest earned: ${interest_earned:,.2f}")


if __name__ == "__main__":
    main()

## Script Execution Output
usage: compound_interest.py [-h]
                            principal annual_rate compounds_per_year years

Calculate compound interest for a principal amount.

positional arguments:
  principal           Initial principal amount
  annual_rate         Annual interest rate in percent (for example 7.34)
  compounds_per_year  Number of compounding periods per year
  years               Total time in years

options:
  -h, --help          show this help message and exit
