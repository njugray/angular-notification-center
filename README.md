#Angular Notification Center
## Install

### Using bower

```
bower install angular-notification-center
```

## Usage

See [DEMO](http://njugray.github.io/notification-center)

### Require

* bootstrap css [optional]
```html
<link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.css">
```   

* angular js
```html
<script src="../bower_components/angular/angular.min.js"></script>
```   
* notification center
```html
<script src="../angular-notification-center.min.js"></script>
```   

### Injected in your module
indect `notification` when initializing your module.   

```javascript
angular.module("myModule",['notification']);
```
### Using Directive in page

```html
  <notification-center nf-messages="messages" nf-name="global">
      <message ng-repeat="message in messages" nf-message="message">
      </message>
  </notification-center>
```

`nfName` defined the name of this notification center, a promise return in property value named since you may have more than on notification centers;
`nfMessages` defined the variable holds notification messages;
`nfMessage` defined the every message in notification messages which may be used in `ngRepeat` or other directive;  


### Using `NfService`

Anywhere you want Notification Center work, use NfService.


```javascript
myModule.controller('notifyCtrl',['$scope', '$log', 'NfService', function($scope, $log, NfService){
  // parameters
  var data = {
      title: 'title',
      message: 'message',
      config: {
          delay: 3000,
          type: 'success',
          dismiss: true
      }
  };

  // a promise return, 'global' is the name of notification center
  var promise = NfService.notify(data)['global'];

  // handle after the notification is dismissed or confirmed;
  promise.then(function(){
      $log.info("notification confirmed  !");
  }, function(){
      $log.info("notification dismissed  !");
  });
}]);
```


## Options
