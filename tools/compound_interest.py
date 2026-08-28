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
