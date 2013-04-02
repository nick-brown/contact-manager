class Contact < ActiveRecord::Base
  attr_accessible :address1, :address2, :first_name, :last_name, :phone, :zip
end
