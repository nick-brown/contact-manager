# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


contacts = Contact.create([
    { first_name: 'Matt', last_name: 'Miller', phone: '4803106712', zip: 96123 },
    { first_name: 'Shannon', last_name: 'Clark', phone: '4802552311', zip: 96123 },
    { first_name: 'Holly', last_name: 'Bevis', phone: '7108906755', zip: 38372 },
                          ])