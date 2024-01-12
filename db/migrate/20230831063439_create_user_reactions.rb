class CreateUserReactions < ActiveRecord::Migration[6.1]
  def change
    create_table :user_reactions do |t|
      t.integer :reaction_id
      t.integer :slide_id
      t.timestamps
    end
  end
end
