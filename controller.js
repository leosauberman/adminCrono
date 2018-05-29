var app = angular.module("cadastro", []);

app.controller("controller", ($scope) => {

    $scope.nCategories = 0;
    $scope.categories = [];
    $scope.showCategories = function(){
        for(let i = 0; i < $scope.nCategories; i++){
            $scope.categories.push(i+1);
            $scope.tasks.push(i);
        }
    }
    $scope.tasks = [];
    
});