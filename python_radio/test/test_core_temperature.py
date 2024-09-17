import unittest
from unittest.mock import patch, MagicMock
import numpy as np

# Import the function to be tested
from core_temperature import calculate_change_core_temperature, RiskLevelData

class TestCoreTemperature(unittest.TestCase):

  # def setUp(self):
  #   # Mock the Logger to prevent actual logging during tests
  #   self.logger_patcher = patch('your_module.Logger')
  #   self.mock_logger = self.logger_patcher.start()

  # def tearDown(self):
  #   self.logger_patcher.stop()

  def test_valid_input(self):
    # Arrange
    test_data = RiskLevelData(
      heightM=1.75,
      weightKg=70,
      ageYears=30,
      sex='male',
      Ta=30,
      RH=60
    )

    # Act
    result = calculate_change_core_temperature(test_data)

    # Assert
    self.assertIsNotNone(result)
    self.assertIsInstance(result, float)

  def test_missing_data(self):
    # Arrange
    test_data = RiskLevelData(
      heightM=1.75,
      weightKg=70,
      ageYears=30,
      sex='male',
      Ta=None,  # Missing Ta
      RH=60
    )

    # Act
    result = calculate_change_core_temperature(test_data)

    # Assert
    self.assertIsNone(result)

if __name__ == '__main__':
  unittest.main()