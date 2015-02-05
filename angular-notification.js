/*! Angular notification v0.1.0 | (c) 2015 njugray | License MIT */

angular.module('notification',[])
.directive('notificationCenter', function(){
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: 
            '<div class="notification-center">' +
            '   <div ng-transclude></div>'+
            '</div>',
        controller: ['$scope', '$element', '$attrs', 'NfService','$q', function($scope, $element, $attr, NfService, $q){
            $scope.messages = [];
            function dismiss(obj){
                var index = $scope.messages.indexOf(obj);
                if(index !== -1){
                    $scope.messages.splice(index, 1);
                }
            }

            function resovle(obj){
                var index = $scope.messages.indexOf(obj);
                if(index !== -1){
                    $scope.messages.splice(index, 1);
                }
            }

            function handlePromise(promise, obj){
                promise.then(function(){
                    resovle(obj);
                }, function(){
                    dismiss(obj);
                });
            }
           

            $scope.$receive = function(obj){
                $scope.messages.push(obj);
                var defer = $q.defer();
                var promise = defer.promise;
                obj._defer = defer;
                handlePromise(promise, obj);
                return promise;
            };
            NfService.register($scope.notificationName, function(nfObj){
                return $scope.$receive(nfObj);
            });


        }],
        scope: {
            messages: '=nfMessages',
            notificationName: '@nfName'
        },
    };
})
.directive('message', function(){
    return {
        restrict: 'E',
        require: '^notificationCenter',
        replace: true,
        transclude: true,
        template: 
            '<div ng-mouseenter="mouseenter()" ng-mouseleave="mouseleave()">'+
            '  <div class="alert clearfix alert-{{message.config.type}}" ng-class="{\'alert-dismissible\':message.config.dismiss}">\n'+
            '   <button ng-if="message.config.dismiss" type="button" class="close" data-dismiss="alert" aria-label="Close" ng-click="close()"><span aria-hidden="true">&times;</span></button>\n'+
            '   <div>'+
            '       <div class=""><label>{{message.title}}</label></div>'+
            '       <div class="pull-left">{{message.msg}}</div>'+

            '       <div class="btn btn-primary pull-right"'+
            '           ng-if="message.config.confirm" '+
            '           ng-click="confirm(message)">{{message.config.confirmText}}</div>'+
            '           </div>'+
            '   </div>'+
            '</div>',
        
        scope: {
            message: '=nfMessage',
            onDismiss: '&',
            onConfirm: '&'
        },
        controller: ['$scope', '$element', '$attrs', 'NfService','$q', '$timeout', function($scope, $element, $attr, NfService, $q, $timeout){
            var message = $scope.message;
            var defer = message._defer;
            message._defer = null;

            var shouldDismissAfterDelay = (message.config.delay && message.config.delay > 0);

            var dimissFunc = function(){
                defer.reject("notification dismissed");
            };

            if(shouldDismissAfterDelay){
                $scope.dismissTimer = $timeout(dimissFunc, message.config.delay);
            }


            $scope.close = function(){
                defer.reject("notification dismissed");
            };
            $scope.confirm = function(data){
                defer.resolve(data);
            };
            $scope.mouseenter = function(){
                if(shouldDismissAfterDelay){
                    $timeout.cancel($scope.dismissTimer);
                }
            };

            $scope.mouseleave = function(){
                if(shouldDismissAfterDelay){
                    $scope.dismissTimer = $timeout(dimissFunc, message.config.delay);
                }
            };
            $scope.$on('$destory', function(){
                console.log('destoried');
                if(shouldDismissAfterDelay){
                    $timeout.cancel($scope.dismissTimer);
                }
            });

        }]
    };
})
.provider('NfService', function(){
    //
    var _config = {
        type: 'info',
        dismiss: false,
        confirm: false,
        confirmText: 'ok',
        delay: 3000,
    };

    this.$get = ['$window', '$rootScope','$log', function($window, $rootScope, $log){
        //notification object
        var Notification = function(title, msg, config){
            config = angular.extend({}, _config, config);
            if(!config.delay || config.delay === '0' || config.delay === 0){
                config.dismiss = true;
            }
            this.title = title;
            this.msg = msg;
            this.config = config;
        };

        Notification.prototype.for = function(target){
            this.target = target;
            return this;
        };

        //return a service object
        var service = {},
            listeners = [];

        // setting: {
        //     title: '',
        //     message: '',
        //     config: '',
        //     target: ''
        // }
        service.notify = function(setting){
            var title = setting.title, 
                msg = setting.message, 
                config = setting.config, 
                target = setting.target;

            var nfObj = new Notification(title, msg, config);
            var targets = [];
            if(angular.isArray(target)){
                targets = target;
            }
            if(typeof target === 'string'){
                targets.push(target);
            }

            var promises = {};
            for(var i= 0,n = listeners.length; i < n; i++){
                var listener = listeners[i];
                if(targets.length === 0 || targets.indexOf(listener.name) !== -1){
                    if(typeof listener.handle === 'function'){
                        if(promises[listener.name]){
                            promises[listener.name] = [promises[listener.name]];
                            promises[listener.name].push(promises[listener.name]);
                        }else{
                            promises[listener.name] = listener.handle(nfObj);
                        }
                        
                    }
                }
                
            }
            return promises;
        };
        service.register = function(name, handle){
            listeners.push({
                name: name,
                handle: handle
            });
        };

        service.unregister = function(name, handle){
            for(var i =0, n = listeners.length; i < n; i++){
                if(listeners[i].name === name && listeners[i].handle === handle){
                    listeners.splice(i,1);
                    i--;
                    n--;
                    continue;
                }
            }
        };

        service.unregisterAll = function(name){
            for(var i =0, n = listeners.length; i < n; i++){
                if(listeners[i].name === name){
                    listeners.splice(i,1);
                    i--;
                    n--;
                    continue;
                }
            }
        };
        return service;
    }];
});