class UsersController < ApplicationController
  def index
    @users = User.all
    render json: @users
  end

  def show
    # @user = User.find(params[:id])
    # @user = User.find_by(name: params[:name])
    # render json: @user
  end

  def create
    @user = User.new(create_user_params)
    @user.create_password
    if @user.save
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(update_user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
  end

  private
    def create_user_params
      params.require(:user).permit(:client_id, :name)
    end

    def update_user_params
      params.require(:user).permit(:name, :score, :billing, :rank)
    end
end

