/** \file
 *  Game Develop
 *  2008-2013 Florian Rival (Florian.Rival@gmail.com)
 */

#include "JoystickTools.h"
#include "GDCpp/RuntimeScene.h"
#include <SFML/System.hpp>
#include <SFML/Graphics.hpp>

bool GD_API JoystickButtonDown( RuntimeScene & scene, unsigned int joystick, unsigned int button )
{
    return sf::Joystick::isButtonPressed(joystick, button);
}

double GD_API GetJoystickAxisValue( RuntimeScene & scene, unsigned int joystick, const std::string & axisStr )
{
    sf::Joystick::Axis axis;
    if ( axisStr == "AxisX" ) axis = sf::Joystick::X;
    else if ( axisStr == "AxisY" ) axis = sf::Joystick::Y;
    else if ( axisStr == "AxisZ" ) axis = sf::Joystick::Z;
    else if ( axisStr == "AxisR" ) axis = sf::Joystick::R;
    else if ( axisStr == "AxisU" ) axis = sf::Joystick::U;
    else if ( axisStr == "AxisV" ) axis = sf::Joystick::V;
    else if ( axisStr == "AxisPOV" ) axis = sf::Joystick::PovX; //Deprecated
    else if ( axisStr == "AxisPovX" ) axis = sf::Joystick::PovX;
    else if ( axisStr == "AxisPovY" ) axis = sf::Joystick::PovY;
    else return 0;

    return sf::Joystick::getAxisPosition(joystick, axis);
}

void GD_API JoystickAxisValueToVariable( RuntimeScene & scene, unsigned int joystick, const std::string & axisStr, const std::string & variable )
{
    //Obtain axis and joystick
    sf::Joystick::Axis axis;
    if ( axisStr == "AxisX" ) axis = sf::Joystick::X;
    else if ( axisStr == "AxisY" ) axis = sf::Joystick::Y;
    else if ( axisStr == "AxisZ" ) axis = sf::Joystick::Z;
    else if ( axisStr == "AxisR" ) axis = sf::Joystick::R;
    else if ( axisStr == "AxisU" ) axis = sf::Joystick::U;
    else if ( axisStr == "AxisV" ) axis = sf::Joystick::V;
    else if ( axisStr == "AxisPOV" ) axis = sf::Joystick::PovX; //Deprecated
    else if ( axisStr == "AxisPovX" ) axis = sf::Joystick::PovX;
    else if ( axisStr == "AxisPovY" ) axis = sf::Joystick::PovY;
    else return;

    //Update variable value
    scene.GetVariables().ObtainVariable(variable) = sf::Joystick::getAxisPosition(joystick, axis);

    return;
}
