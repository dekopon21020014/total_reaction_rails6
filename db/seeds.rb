# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

#Reaction.create([{name: 'hoge'}, {name: 'foo'}, {name: 'huga'}])

reaction = Reaction.create(
    name: "Good"
)
reaction.image.attach(io: File.open("app/assets/images/happy_woman.png"), filename:"good.png")

reaction = Reaction.create(
    name: "Soso"
)
reaction.image.attach(io: File.open("app/assets/images/office_chair_man.png"), filename:"soso.png")

reaction = Reaction.create(
    name: "Bad"
)
reaction.image.attach(io: File.open("app/assets/images/smartphone_gorogoro_man.png"), filename:"bad.png")

N = LIMIT / 3
N.times do |n|
    UserReaction.create(
        reaction_id: 1
    )

    UserReaction.create(
        reaction_id: 2
    )

    UserReaction.create(
        reaction_id: 3
    )
end