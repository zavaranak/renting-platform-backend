For TypeOrm:
TypeOrmModule.forRoot(take only TypeOrmModuleOptions)

TypeOrmModuleOptions can include DataSourceOptions

DataSource is used for migration

So the solution is create a DataSourceOptions, export that DataSourceOptions to TypeOrmModuleOptions.
Meanwhile create new DataSource with that DataSourceOptions by method "new DataSource(DataSourceOptions)"

Actually we can create a Database module, which has datasourceProviders including all INITIALIZED datasouce, then AppModule use DataBase Module as a provider.
This way we don't event have to use TypeOrmModule.forRoot
