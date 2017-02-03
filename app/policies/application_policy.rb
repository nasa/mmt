# :nodoc:
class ApplicationPolicy
  attr_reader :user, :target

  def initialize(user, target)
    @user = user
    @target = target
  end

  def index?
    false
  end

  def show?
    false
  end

  def create?
    false
  end

  def new?
    create?
  end

  def update?
    false
  end

  def edit?
    update?
  end

  def destroy?
    false
  end
end
