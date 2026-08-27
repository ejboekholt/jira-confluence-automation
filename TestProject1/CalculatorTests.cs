using MyApp;
using Xunit;

namespace TestProject1;

public class CalculatorTests
{
    [Fact]
    public void Add_TwoPositiveNumbers_ReturnsSum()
    {
        int result = Calculator.Add(2, 3);
        Assert.Equal(5, result);
    }

    [Fact]
    public void Add_NegativeNumbers_ReturnsSum()
    {
        int result = Calculator.Add(-2, -3);
        Assert.Equal(-5, result);
    }

    [Fact]
    public void Add_PositiveAndNegative_ReturnsSum()
    {
        int result = Calculator.Add(5, -3);
        Assert.Equal(2, result);
    }

    [Fact]
    public void Add_WithZero_ReturnsOtherOperand()
    {
        int result = Calculator.Add(0, 7);
        Assert.Equal(7, result);
    }

    [Fact]
    public void Add_BothZero_ReturnsZero()
    {
        int result = Calculator.Add(0, 0);
        Assert.Equal(0, result);
    }

    [Fact]
    public void Add_MaxValueOverflow_WrapsAround()
    {
        int result = Calculator.Add(int.MaxValue, 1);
        Assert.Equal(int.MinValue, result);
    }

    [Fact]
    public void Add_MinValueUnderflow_WrapsAround()
    {
        int result = Calculator.Add(int.MinValue, -1);
        Assert.Equal(int.MaxValue, result);
    }

    [Theory]
    [InlineData(1, 1, 2)]
    [InlineData(10, 20, 30)]
    [InlineData(-10, 10, 0)]
    public void Add_VariousInputs_ReturnsExpectedSum(int a, int b, int expected)
    {
        int result = Calculator.Add(a, b);
        Assert.Equal(expected, result);
    }
}
