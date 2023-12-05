# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

#Reaction.create([{name: 'hoge'}, {name: 'foo'}, {name: 'huga'}])

reaction = Reaction.create(
    name: "Interesting"
)
reaction.image.attach(io: File.open("app/assets/images/interesting.png"), filename:"interesting.png")

reaction = Reaction.create(
    name: "Sleepy"
)
reaction.image.attach(io: File.open("app/assets/images/sleepy.png"), filename:"sleepy.png")

reaction = Reaction.create(
    name: "Soso"
)
reaction.image.attach(io: File.open("app/assets/images/soso.png"), filename:"soso.png")

UserReaction.create(
    reaction_id: 1
)

UserReaction.create(
    reaction_id: 2
)

UserReaction.create(
    reaction_id: 3
)