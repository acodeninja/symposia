define(['symposia','test/mocks/modules'], function ( symposia, mods ) {
    describe('Core.Modules', function () {
        var moduleData = {};

        before(function() {
            this.started = [];
            this.stopped = [];

            moduleData = symposia.modules.create({
                'module_a': {
                    creator: mods.a
                },
                'module_b': {
                    creator: mods.b,
                    options: {
                        init: false
                    }
                }
            }, function ( data ) {
                return data;
            });

            symposia.bus.subscribe({
                channel: 'modules',
                topic: 'module.started',
                callback: function ( data, envelope ) {
                    this.started.push( data.module.name );
                }
            }).withContext( this );

            symposia.bus.subscribe({
                channel: 'modules',
                topic: 'module.stopped',
                callback: function ( data, envelope ) {
                    this.stopped.push( data.module.name );
                }
            }).withContext( this );

        });

        afterEach(function () {
            this.started = [];
            this.stopped = [];
            symposia.modules.stopAll();
        });

        describe('create', function() {

            it('should create a module', function () {
                assert.isTrue( moduleData.hasOwnProperty('module_a') );
            });

            it('should throw an error if no modules object is passed', function () {
                assert.throws(function() {
                    symposia.modules.create('fred');
                }, Error, 'Create must be passed an object');
            });

            it('should throw an error if callback is not a function', function () {
                assert.throws(function() {
                    symposia.modules.create({
                        'invalidCallback': {
                            creator: mods.a
                        }
                    }, 'hello');
                }, Error, 'Callback must be a function');
            });


            it('should throw an error if no creator is passed', function () {
                assert.throws( function () {
                    symposia.modules.create({
                        'noCreator': {
                            creator: null
                        }
                    });
                }, Error, 'Creator should be an instance of Function');
            });

            it('should throw an error if creator function doesnt return a public interface', function () {
                assert.throws(function () {
                    symposia.modules.create({
                        'noPublicInterface': {
                            creator: function () {}
                        }
                    });
                }, Error, 'Creator should return a public interface');
            });

        });

        describe('start', function () {

            it('should automatically start modules by default', function () {
                symposia.modules.start('module_a');
                assert.includeMembers( this.started, ['module_a'] );
            });

            it('should announce when a module starts', function () {
                symposia.modules.start('module_b');
                assert.includeMembers(this.started,['module_b']);
            });

            it('should throw an error if attempting to start an invalid module', function () {
                // passing no module name
                assert.throws(function () {
                    symposia.modules.start();
                }, Error, 'No id supplied' );

                // passing a invalid module name
                assert.throws(function () {
                    symposia.modules.start('module_z');
                }, Error, 'Unable to find module [module_z]' );

                // passing a non-string
                assert.throws(function () {
                    symposia.modules.start( 12345 );
                }, Error, 'id must be a string, number supplied' );
            });

            it('should be falsy if attempting to start a running module', function () {
                symposia.modules.start('module_b');
                assert.isFalse( symposia.modules.start('module_b') );
            });

            it('should return module instance if starts successfully', function () {
                var module =  symposia.modules.start('module_a');
                assert.property( module, 'init');
                assert.property( module, 'destroy');
            });
        });

        describe('stop', function () {

            it('should return false if trying to stop an inactive module', function () {
                assert.isFalse( symposia.modules.stop('module_a') );
            });

            it('should announce when a module stops', function () {
                symposia.modules.start('module_a');
                symposia.modules.stop('module_a');
                assert.includeMembers( this.stopped, ['module_a'] );
            });

            it('should return true if module stops', function () {
                symposia.modules.start('module_a');
                assert.isTrue( symposia.modules.stop('module_a') );
            });
        });

        describe('stopAll', function () {
            it('should stop all active modules', function () {
                symposia.modules.start('module_a');
                symposia.modules.start('module_b');
                symposia.modules.stopAll();

                assert.includeMembers( this.stopped, ['module_a','module_b'] );
            });
        });

        describe('hasModules', function () {
            it('should be truthy if there are modules', function () {
                assert.isTrue( symposia.modules.hasModules() );
            });
        });


        describe('isStarted', function () {
            it('should be truthy if module is started', function () {
                symposia.modules.start('module_a');
                assert.isTrue( symposia.modules.isStarted('module_a') );
            });
            it('should be falsy if module is stopped', function () {
                assert.isFalse( symposia.modules.isStarted('module_a') );
            });
        });

        describe('isModule', function () {
            it('should throw descriptive errors if invalid id', function () {
                assert.throws( function () {
                    symposia.modules.isModule();
                }, Error, 'No id supplied');
                assert.throws(function () {
                    symposia.modules.isModule(12345);
                }, Error, 'id must be a string, number supplied');
                assert.throws(function () {
                    symposia.modules.isModule('module_z');
                }, Error, 'Unable to find module [module_z]');
            });

            it('should be truthy if module exists', function () {
                assert.isTrue( symposia.modules.isModule('module_a') );
            });
        });

        describe('getStarted', function () {
            it('should return an array of modules that are currently active', function () {
                var started = [];
                symposia.modules.start('module_a');
                started = symposia.modules.getStarted();
                assert.isTrue( _.isArray( started ) );
                assert.lengthOf( started, 1 );
                assert.property( started[0], '_id');
                assert.property( started[0], 'name');
                assert.property( started[0], 'creator');
                assert.property( started[0], 'instance');
            });

            it('should return an empty array if no modules are active', function () {
                assert.lengthOf( symposia.modules.getStarted(), 0);
            });

        });
    });

});