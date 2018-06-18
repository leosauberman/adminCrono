var app = angular.module("cadastro", []);

    app.controller("controller", ($scope, $http, $log) => {
        $scope.serverUrl = "https://shrouded-chamber-84977.herokuapp.com/admin";
        $scope.catOptions = ["Descoberta", "Ideação", "Design", "Desenvolvimento", "Evolução"];
        $scope.categoryText = '';
        $scope.dueDate = '';
        $scope.category = '';
        $scope.tasks = [];
        $scope.style = { 'color': 'green'};
        
        $http({
            method: "GET",
            url: $scope.serverUrl,
            headers: {
                'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,DELETE',
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
            }
        }).then((response) => {
            for(i in response.data.body){
                for(j in response.data.body[i]){
                    $scope.tasks.push(response.data.body[i][j]);
                }
            }
            $scope.tasks = $scope.tasks.sort(function (a, b) {
                return a.index - b.index;
            })
        }, (err) => {
            console.log("request error");
        })
    
        $scope.addCategory = function(){
           if($scope.catOptions.indexOf($scope.categoryText) == -1){
                $scope.catOptions.push($scope.categoryText);        
            }
            else{
                alert('Categoria já existente');        
            }
            
            $scope.categoryText = '';
        }

        
        $scope.addItem = () => {
            
            $scope.errorText ='';
            
            if(!$scope.taskText){return;}
            
            if($scope.tasks.indexOf($scope.taskText) == -1){
                if($scope.tasks.length > 0){
                    $scope.tasks.push(
                        {
                            text: $scope.taskText,
                            dueDate: $scope.dueDate,
                            category: $scope.category,
                            done: false,
                            index: $scope.tasks[$scope.tasks.length - 1].index + 1
                        });
                }
                else{
                    $scope.tasks.push(
                        {
                            text: $scope.taskText,
                            dueDate: $scope.dueDate,
                            category: $scope.category,
                            done: false,
                            index: 0
                        });
                }
                console.log($scope.tasks);
            }
            else{
                
                $scope.errorText = "The item is already in the list";
                
            }
            
            $scope.taskText = '';
        }
        
        $scope.removeItem = function(index) {
            for(i in $scope.tasks){
                if($scope.tasks[i].index == index){
                    $log.debug("Deleted: ", $scope.tasks[i]);
                    $scope.tasks.splice(i, 1);
                }
            }
        }

        $scope.check = function(index) {
            for(i in $scope.tasks){
                if($scope.tasks[i].index == index){
                    $log.debug("Checked: ", $scope.tasks[i]);
                    $scope.tasks[i].done = !$scope.tasks[i].done;
                }
            }
        }
        
        $scope.sortColumn = "dueDate";
        $scope.reverseSort = false;

        $scope.sortData = function (column) {
            $scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
            $scope.sortColumn = column;
        }
        $scope.getSortClass = function (column) {
            if($scope.sortColumn == column){
                return $scope.reverseSort ?  'arrow-down' : 'arrow-up';
            }
            else{
                return ''; 
            }
        }

        $scope.json = {};
        $scope.saveJson = function () {
            if(angular.equals($scope.json, {})){
                for(i in $scope.catOptions){
                    $scope.json[$scope.catOptions[i]] = [];
                }
                for(i in $scope.tasks){
                    $scope.json[$scope.tasks[i].category].push($scope.tasks[i]);
                }
            }
            else{
                for(i in $scope.tasks){
                    $scope.json[$scope.tasks[i].category].push($scope.tasks[i]);
                }
            }
            console.log($scope.json);
            $http({
                method: "POST",
                url: $scope.serverUrl,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,DELETE',
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                },
                data: $scope.json
            })
            .then(function success(res){
                console.log(res.data);
            }, function error(err){
                console.log(err);
            });
        }
});
