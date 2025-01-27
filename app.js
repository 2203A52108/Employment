angular.module('employeeApp', [])
  .controller('employeeController', function($scope, $http) {
    $scope.isLoggedIn = false;
    $scope.isAdmin = false;
    $scope.showAddEmployee = false;
    $scope.showEditEmployee = false;
    $scope.user = {};
    $scope.newUser = {};
    $scope.newEmployee = {};
    $scope.currentEmployee = {};
    $scope.employees = [];

    // Login
    $scope.login = function() {
      $http.post('http://localhost:3000/api/login', $scope.user)
        .then(function(response) {
          if (response.data.success) {
            $scope.isLoggedIn = true;
            $scope.isAdmin = response.data.role === 'Admin';
            $scope.fetchEmployees();
          } else {
            alert('Invalid credentials');
          }
        })
        .catch(function(error) {
          console.error('Error logging in:', error);
        });
    };

    // Signup
    $scope.signup = function() {
      $http.post('http://localhost:3000/api/signup', $scope.newUser)
        .then(function(response) {
          alert(response.data.message);
          $scope.newUser = {};
        })
        .catch(function(error) {
          console.error('Error signing up:', error);
        });
    };

    // Fetch employees
    $scope.fetchEmployees = function() {
      $http.get('http://localhost:3000/api/employees')
        .then(function(response) {
          $scope.employees = response.data;
        })
        .catch(function(error) {
          console.error('Error fetching employees:', error);
        });
    };

    // Add employee
    $scope.addEmployeeForm = function() {
      $scope.showAddEmployee = true;
    };

    $scope.addEmployee = function() {
      $http.post('http://localhost:3000/api/employees', $scope.newEmployee)
        .then(function(response) {
          $scope.employees.push(response.data);
          $scope.newEmployee = {};
          $scope.showAddEmployee = false;
        })
        .catch(function(error) {
          console.error('Error adding employee:', error);
        });
    };

    // Edit employee
    $scope.editEmployee = function(employee) {
      $scope.currentEmployee = angular.copy(employee);
      $scope.showEditEmployee = true;
    };

    // Cancel edit
    $scope.cancelEdit = function() {
      $scope.showEditEmployee = false;
      $scope.currentEmployee = {};
    };

    // Update employee
    $scope.updateEmployee = function() {
      $http.put('http://localhost:3000/api/employees/' + $scope.currentEmployee.id, $scope.currentEmployee)
        .then(function(response) {
          const index = $scope.employees.findIndex(emp => emp.id === $scope.currentEmployee.id);
          if (index !== -1) {
            $scope.employees[index] = response.data;
          }
          $scope.showEditEmployee = false;
          $scope.currentEmployee = {};
        })
        .catch(function(error) {
          console.error('Error updating employee:', error);
        });
    };

    // Delete employee
    $scope.deleteEmployee = function(employee) {
      $http.delete('http://localhost:3000/api/employees/' + employee.id)
        .then(function() {
          const index = $scope.employees.indexOf(employee);
          if (index !== -1) {
            $scope.employees.splice(index, 1);
          }
        })
        .catch(function(error) {
          console.error('Error deleting employee:', error);
        });
    };
  });
