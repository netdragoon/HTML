var app = angular.module('app', []);

app.value('$url', 'http://webapi-23.apphb.com/api/v1/my');

app.factory('$web', function($http, $url)
{    
    return {        
        all: function(response)
        {
            $http.get($url)
                 .then(response);
        },
        add: function(model, response)
        {                
            $http.post($url, model)
                .then(response);
        },
        edit: function(model, response)
        {
            $http.put($url + '/' + model.Id + '/edit', model)
                .then(response);                        
        },
        delete: function(id, response)
        {
            $http.delete($url + '/' + id + '/delete')
                .then(response);                        
        }             
    }    
});

app.controller('ctrl', function($scope, $http, $web)
{
    
    $scope.data = [];   
    
    $scope.load = function()
    {
        $web.all(function(response)
        {
            $scope.data = response.data;    
        });          
    }
    
    $scope.add = function(model)
    {        
        model.DateCreated = new Date();
        model.DateUpdated = new Date();
        
        $web.add(model, function(response)
        {
           $scope.data.push(response.data); 
           $scope.data.sort(function(a,b)
           {
               var a1 = a.toLowerCase();
               var b1 = b.toLowerCase();
               if (a1.Description < b1.Description) return -1; 
               if (a1.Description > b1.Description) return 1;
               return 0;
           });          
        });
    }
    
    $scope.edit = function(model)
    {
        model.DateCreated = new Date();
        model.DateUpdated = new Date();
        
        $web.edit(model, function(response)
        {
            var i = 0;
            var status = false;
            while (i < $scope.data.length && status === false)
            {
                if (response.data.Id == $scope.data[i].Id)
                {
                    $scope.data[i] = response.data;
                    status = true;
                }
                i++;
            }
        });
    }
    
    $scope.delete = function(id)
    {
        
        if (confirm('Deseja excluir?'))
        {
            $web.delete(id, function(response)
            {
                var i = 0;
                var status = false;
                while (i < $scope.data.length && status === false)
                {
                    if (id == $scope.data[i].Id)
                    {
                        $scope.data.splice(i, 1);
                        status = true;
                    }
                    i++;
                }
            });    
        }
                
    }
    
    $scope.load();
    
});