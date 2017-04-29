'use strict';

angular.module('confusionApp')
.constant("baseURL","http://localhost:3000/")
        .service('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
            this.getDishes = function(){
                return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});
            };
            
                this.getPromotions = function(){
                    return $resource(baseURL+'promotions/:id', null, {'update':{method:'PUT'}})
                };
    
                        
        }])

        .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
            var corpfac = {};
            this.getLeaders = function(){
                return $resource(baseURL+"leadership/:id",null,  {'update':{method:'PUT' }});
            };
            corpfac.getLeaders = this.getLeaders;
            return corpfac;
        }])

        .factory('feedbackFactory', ['$resource', 'baseURL', function($resource, baseURL){
            var corpfac = {};
            this.getFeedbacks = function(){
                return $resource(baseURL+"feedback/:id",null,  {'save':{method:'POST' }});
            };
            corpfac.getFeedbacks = this.getFeedbacks;
            return corpfac;
        }])
        ;