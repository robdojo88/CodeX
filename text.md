//problem1
// Log positive numbers starting at 2019, counting down by 8.

function countDownBy8() {
for (let i = 2019; i > 0; i -= 8) {
console.log(i);
}
}
// Test Cases (1/1)
// countDownBy8() to log 2019 2011 2003 1995 1987 1979 1971 1963 1955 1947 1939 1931 1923 1915 1907 1899 1891 1883 1875 1867 1859 1851 1843 1835 1827 1819 1811 1803 1795 1787 1779 1771 1763 1755 1747 1739 1731 1723 1715 1707 1699 1691 1683 1675 1667 1659 1651 1643 1635 1627 1619 1611 1603 1595 1587 1579 1571 1563 1555 1547 1539 1531 1523 1515 1507 1499 1491 1483 1475 1467 1459 1451 1443 1435 1427 1419 1411 1403 1395 1387 1379 1371 1363 1355 1347 1339 1331 1323 1315 1307 1299 1291 1283 1275 1267 1259 1251 1243 1235 1227 1219 1211 1203 1195 1187 1179 1171 1163 1155 1147 1139 1131 1123 1115 1107 1099 1091 1083 1075 1067 1059 1051 1043 1035 1027 1019 1011 1003 995 987 979 971 963 955 947 939 931 923 915 907 899 891 883 875 867 859 851 843 835 827 819 811 803 795 787 779 771 763 755 747 739 731 723 715 707 699 691 683 675 667 659 651 643 635 627 619 611 603 595 587 579 571 563 555 547 539 531 523 515 507 499 491 483 475 467 459 451 443 435 427 419 411 403 395 387 379 371 363 355 347 339 331 323 315 307 299 291 283 275 267 259 251 243 235 227 219 211 203 195 187 179 171 163 155 147 139 131 123 115 107 99 91 83 75 67 59 51 43 35 27 19 11 3

//problem2
// Kelvin wants to convert between temperature scales. Create celciusToFahrenheit(cDegrees) that accepts a number of degrees in Celcius, and returns the equivalent temperature as expressed in Fahrenheit degrees. For review, Fahrenheit = (9/5 \* Celsius) + 32.

function celciusToFahrenheit(cDegrees) {
//code here
}

// Test Cases (3/3)
// celciusToFahrenheit(0) to return 32
// celciusToFahrenheit(10) to return 50
// celciusToFahrenheit(100) to return 212

//problem3

// Given an array, write a function that changes all positive numbers in the array to “big”.
// Example: makeItBig([-1,3,5,-5]) returns that same array, changed to [-1,"big","big",-5].

function makeItBig(arr) {
//code here
}
// Test Cases (3/3)
// makeItBig([-1,3,5,-5]) to return [-1,"big","big",-5]
// makeItBig([2,4,6]) to return ["big","big","big"]
// makeItBig([-4,0,4]) to return [-4,0,"big"]

//problem4

// Given an array, create a function to return a new array where each value in the original has been doubled. Calling double([1,2,3]) should return [2,4,6].

function double(arr) {
//code here
}

// Test Cases (3/3)
// double([1,2,3]) to return [2,4,6]
// double([-2, 0, 2]) to return [-4,0,4]
// double([2,10,100]) to return [4,20,200]

//problem5

// Given an array and a value Y, count and return the number of array values greater than Y.
// For example, returnArrayCountGreaterThanY( [2,3,5], 4) should return 1 as there is only one element in the array whose value is greater than 4.

function returnArrayCountGreaterThanY(arr, y) {
// code here
}
// Test Cases (4/4)
// returnArrayCountGreaterThanY( [2,3,5], 4) to return 1
// returnArrayCountGreaterThanY( [2,3,5], 1) to return 3
// returnArrayCountGreaterThanY( [4,10,15], 10) to return 1
// returnArrayCountGreaterThanY( [4,10,15], 20) to return 0

//problem6

// Implement function sigma(num) that given a number, returns the sum of all positive integers up to a number (inclusive).
// Ex.:sigma(3)=6(or1 + 2 + 3); sigma(5)=15(or1 + 2 + 3 + 4 + 5).

function sigma(num) {
//Code here
}
// Test Cases (4/4)
// sigma(3) to return 6
// sigma(5) to return 15
// sigma(6) to return 21
// sigma(8) to return 36

//problem7

// Just the Facts, ma’am. Factorials, that is. Write a function factorial(num) that, given a number, returns the product (multiplication) of all positive integers from 1 up to number (inclusive).
// For example, factorial(3)=6(or1 _ 2 _ 3);factorial(5)=120(or1 _ 2 _ 3 _ 4 _ 5).

function factorial(num) {
//Code here
}

// Test Cases (4/4)
// factorial(3) to return 6
// factorial(5) to return 120
// factorial(7) to return 5040
// factorial(8) to return 40320

//problem8

// Given an array, swap first and last, second and second-to-last, third and third-to-last, etc. Have the function return this swapped array.
// For example, swapTowardCenter([true,42,"Ada",2,"pizza"]) should return ["pizza",2,"Ada",42,true]. Passing [1,2,3,4,5,6] should return [6,5,4,3,2,1].

function swapTowardCenter(arr) {
//Code here
}
// Test Cases (3/3)
// swapTowardCenter([true,42,"Ada",2,"pizza"]) to return ["pizza",2,"Ada",42,true]
// swapTowardCenter([1,2,3,4,5,6]) to return [6,5,4,3,2,1]
// swapTowardCenter(["hi", "coding", "dojo", "fans"]) to return ["fans","dojo","coding","hi"]

//problem9

// Create threesFives(n) that adds values from 1 and n (inclusive) if that value is not divisible by 3 or 5. Return the final sum.
// For example, threesFives(10) returns 22 as it only returns the sum of 1, 2, 4, 7, and 8. In that example, it skips 3, 6, and 9 as those are divisible by 3. It also skips 5, and 10 as it's divisible by 5.

function threesFives(num) {
//Code here
}

// Test Cases (2/2)
// threesFives(10) to return 22
// threesFives(15) to return 60

//problem10

// Kaitlin sees beauty in numbers but also believes that less is more. Implement sumToOne(num) that sums a given integer’s digits repeatedly until the sum is only one digit. Return that one-digit result.
// Example: sumToOne(928) returns 1, because 9+2+8 = 19, then 1+9 = 10, then 1+0 = 1.
// Solve the challenge WITHOUT using recursion although you are allowed to convert the integer to a string.

function sumToOne(num) {
//Code here
}

// Test Cases (4/4)
// sumToOne(35) to return 8
// sumToOne(928) to return 1
// sumToOne(5798) to return 2
// sumToOne(35798) to return 5

// Return whether a given integer is prime. Prime numbers are only evenly divisible by themselves and 1. Many highly optimized solutions exist, but for now, just create one that is easy to understand and debug.
// For example, isPrime(3) should return true. isPrime(4) should return false as 4 is divisible by 2.

function isPrime(num) {
//Code here
}

// Test Cases (5/5)
// isPrime(3) to return true
// isPrime(4) to return false
// isPrime(13) to return true
// isPrime(65) to return false
// isPrime(17) to return true

//problem12

// Alan is good at breaking secret codes. One method is to eliminate values that lie within a specific known range. Given arr and values min and max, retain only the array values between min and max. Work in-place: return the array you are given, with values in the original order. No built-in array functions.

function filterRange(arr, min, max) {
//Code here
}
// Test Cases (5/5)
// filterRange([1,3,5,7,10], 4, 8) to return [5,7]
// filterRange([1,3,5,7,10], -1, 4) to return [1,3]
// filterRange([2,4,3,5], 2, 6) to return [4,3,5]
// filterRange([2,4,3,5], 0, 4) to return [2,3]
// filterRange([6,2,-3,5,7], 3, 8) to return [6,5,7]

//problem13

// Replicate JavaScript’s concat(). Create a standalone function that accepts two arrays. Return a new array containing the first array’s elements, followed by the second array’s elements. Do not alter the original arrays.
// Ex.: arrConcat( ['a','b'], [1,2] ) should return a new array ['a','b',1,2].

function arrayConcat(arr1, arr2) {
//Code here
}

// Test Cases (4/4)
// arrayConcat([1,2], [3,4]) to return [1,2,3,4]
// arrayConcat([1,2], [3,4,5]) to return [1,2,3,4,5]
// arrayConcat([1,2,3], [3,4,5,6]) to return [1,2,3,3,4,5,6]
// arrayConcat([ -1 ], [ -5, 3 ]) to return [-1,-5,3]

//problem14

// Return the second-to-last element of an array. Given [42,true,4,"Kate",7], return "Kate". If array is too short, return null.

function secondToLast(arr) {
//Code here
}

// Test Cases (4/4)
// secondToLast( [42,true,4,"Kate",7] ) to return Kate
// secondToLast([42,true,4,"Kate",7, 9] ) to return 7
// secondToLast([42,true,4,"Kate",7, 9, "dojo", "awesome"]) to return dojo
// secondToLast([1]) to return null

//problem15

// Create a standalone function that accepts two arrays and combines their values sequentially into a new array, at alternating indices starting with the first array. Extra values from either array should be included afterward.
// Given [1,2] and [10,20,30,40], return new array containing [1,10,2,20,30,40].

function zipIt(arr1, arr2) {
//Code here
}

// Test Cases (5/5)
// zipIt([1,2], [10,20,30,40 ]) to return [1,10,2,20,30,40]
// zipIt([1,2,3,4], [10,20 ]) to return [1,10,2,20,3,4]
// zipIt([1,2,3,4], [10,20,30,40 ]) to return [1,10,2,20,3,30,4,40]
// zipIt([1], [10,20 ]) to return [1,10,20]
// zipIt([1,2,3], [10 ]) to return [1,10,2,3]
